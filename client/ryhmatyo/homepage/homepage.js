import "./homepage.css";
import { getUserDataSqlLatest, getUserInfo, getUserDataSqlAll, getUserData } from "../src/js/kubios-data.js";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import * as am5radar from "@amcharts/amcharts5/radar";

const data = await getUserDataSqlLatest();
const readinessData = data.readiness_data;
const stressData = data.stress_data;
const physiologicalData = data.physiological_age;
const allData = await getUserDataSqlAll();
const userInfo = await getUserData();
// const entryData = await fetchDiaryEntries();
// console.log(entryData)


//Päivien formatointidunktiot
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString("fi-FI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
// Tekoälyltä haettu tieto formatointitapoihin ja itse sovellettu
// Formatoidaan päivämäärä ilman kellonaikaa
function formatDateClock(iso) {
  const d = new Date(iso);
  return d.toLocaleString("fi-FI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}



am5.ready(function () {
  // Create root element
  var root = am5.Root.new("hrvchart");

  const myTheme = am5.Theme.new(root);

  myTheme.rule("AxisLabel", ["minor"]).setAll({
    dy: 1,
  });

  myTheme.rule("AxisLabel").setAll({
    fontSize: "0.65em",
  });

  // Set themes
  root.setThemes([
    am5themes_Animated.new(root),
    myTheme,
    am5themes_Responsive.new(root),
  ]);

  /* HRV chart */

  // Create chart
  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      paddingLeft: 0,
    }),
  );

  // Add cursor
  var cursor = chart.set(
    "cursor",
    am5xy.XYCursor.new(root, {
      behavior: "none",
    }),
  );
  cursor.lineY.set("visible", false);


  // Create axes
  var xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      maxDeviation: 0.2,
      baseInterval: {
        timeUnit: "day",
        count: 1,
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minorGridEnabled: true,
        minorLabelsEnabled: true,
      }),
      tooltip: am5.Tooltip.new(root, {}),
    }),
  );

  xAxis.set("minorDateFormats", {
    day: "dd",
    month: "MMM",
  });

  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        pan: "zoom",
      }),
    }),
  );

  // Add series

  //HRV
  var hrvseries = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: "Series",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "hrv",
      valueXField: "date",
      stroke: am5.color(0x000000),
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}",
      }),
    }),
  );


  hrvseries.bullets.push(function () {
    var graphics = am5.Circle.new(root, {
      radius: 4,
      interactive: true,
      cursorOverStyle: "ns-resize",
      stroke: am5.color(0x000000),
      fill: am5.color(0x000000),
    });

    return am5.Bullet.new(root, {
      sprite: graphics,
    });
  });


  // manipulating with mouse code
  var isDown = false;

  // register down
  chart.plotContainer.events.on("pointerdown", function () {
    isDown = true;
  });
  // register up
  chart.plotContainer.events.on("globalpointerup", function () {
    isDown = false;
  });

  chart.plotContainer.events.on("globalpointermove", function (e) {
    // if pointer is down
    if (isDown) {
      // get tooltip data item
      var tooltipDataItem = hrvseries.get("tooltipDataItem");
      if (tooltipDataItem) {
        if (e.originalEvent) {
          var position = yAxis.coordinateToPosition(
            chart.plotContainer.toLocal(e.point).y,
          );
          var value = yAxis.positionToValue(position);
          // need to set bot working and original value
          tooltipDataItem.set("valueY", value);
          tooltipDataItem.set("valueYWorking", value);
        }
      }
    }
  });

  chart.plotContainer.children.push(
    am5.Label.new(root, {
      x: am5.p100,
      centerX: am5.p100,
    }),
  );

  // Set data
  
    const latest7 = allData
      .sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date))
      .slice(0, 7)
      .reverse();

    const data = latest7.map(item => ({
      date: new Date(item.entry_date).getTime(),
      hrv: parseFloat(item.hrv_data),
      stress: parseFloat(item.stress_data),
      readiness: parseFloat(item.readiness_data),

    }));

    hrvseries.data.setAll(data);
    window.hrvDataForDialog = data;
    console.log(data);

  
  hrvseries.appear(1000);
  chart.appear(1000, 100);

  
// HRV treenisuositus
function updateHrvRecommendation() {
  const recommendationEl = document.getElementById("hrvRecommendation");

  if (!window.hrvDataForDialog || window.hrvDataForDialog.length === 0) {
    recommendationEl.textContent = "HRV‑dataa ei ole saatavilla.";
    return;
  }

  // Käyttää uusinta HRV-arvoa
  const latestHrv =
    window.hrvDataForDialog[window.hrvDataForDialog.length - 1].hrv;

  let text = "";

  if (latestHrv >= 65) {
    text =
      "Palautumisesi on hyvä. Voit nostaa treenin rasitusta tai tehdä tehoharjoituksen.";
  } else if (latestHrv >= 50) {
    text =
      "Palautuminen on kohtalainen. Suositellaan maltillista harjoittelua.";
  } else {
    text =
      "Palautuminen on heikko. Kevyt harjoitus tai lepo tukee kehon palautumista.";
  }

  recommendationEl.textContent = text;
}



  /* READINESS GAUGE */

  var readinessRoot = am5.Root.new("readinessGauge");

  readinessRoot.setThemes([am5themes_Animated.new(readinessRoot)]);

  var readinessChart = readinessRoot.container.children.push(
    am5radar.RadarChart.new(readinessRoot, {
      panX: false,
      panY: false,
      startAngle: 160,
      endAngle: 380,
    }),
  );

  var axisRenderer = am5radar.AxisRendererCircular.new(readinessRoot, {
    innerRadius: -30,
  });

  var xAxisGauge = readinessChart.xAxes.push(
    am5xy.ValueAxis.new(readinessRoot, {
      min: 0,
      max: 100,
      strictMinMax: true,
      renderer: axisRenderer,
    }),
  );

  var axisDataItem = xAxisGauge.makeDataItem({});

  var hand = am5radar.ClockHand.new(readinessRoot, {
    radius: am5.percent(95),
    bottomWidth: 10,
  });

  axisDataItem.set(
    "bullet",
    am5xy.AxisBullet.new(readinessRoot, { sprite: hand }),
  );

  xAxisGauge.createAxisRange(axisDataItem);

  var label = readinessChart.radarContainer.children.push(
    am5.Label.new(readinessRoot, {
      centerX: am5.percent(50),
      centerY: am5.percent(50),
      fontSize: "30px",
      textAlign: "center",
      fill: am5.color(0xffffff),
    }),
  );

  // READINESS Kubios Arvo

  const readinessValue = readinessData;

  axisDataItem.set("value", readinessValue);
  label.set("text", readinessValue.toString());

  // Axis range colors
  var bands = [
    { from: 0, to: 25, color: 0xee1f25 },
    { from: 25, to: 50, color: 0xfdae19 },
    { from: 50, to: 75, color: 0xb0d136 },
    { from: 75, to: 100, color: 0x0f9747 },
  ];

  bands.forEach(function (band) {
    var range = xAxisGauge.createAxisRange(
      xAxisGauge.makeDataItem({
        value: band.from,
        endValue: band.to,
      }),
    );

    range.get("axisFill").setAll({
      visible: true,
      fill: am5.color(band.color),
      fillOpacity: 0.85,
    });
  });

readinessChart.appear(1000, 100);

/* STRESS GAUGE/PNS-index */

var stressRoot = am5.Root.new("stressGauge");

stressRoot.setThemes([am5themes_Animated.new(stressRoot)]);

var stressChart = stressRoot.container.children.push(
  am5radar.RadarChart.new(stressRoot, {
    panX: false,
    panY: false,
    startAngle: 160,
    endAngle: 380,
  }),
);

var axisRenderer = am5radar.AxisRendererCircular.new(stressRoot, {
  innerRadius: -30,
});

var xAxisGauge = stressChart.xAxes.push(
  am5xy.ValueAxis.new(stressRoot, {
    min: 0,
    max: 15,
    strictMinMax: true,
    renderer: axisRenderer,
  }),
);

var axisDataItem = xAxisGauge.makeDataItem({});

var hand = am5radar.ClockHand.new(stressRoot, {
  radius: am5.percent(95),
  bottomWidth: 10,
});

axisDataItem.set("bullet", am5xy.AxisBullet.new(stressRoot, { sprite: hand }));

xAxisGauge.createAxisRange(axisDataItem);

var label = stressChart.radarContainer.children.push(
  am5.Label.new(stressRoot, {
    centerX: am5.percent(50),
    centerY: am5.percent(50),
    fontSize: "35px",
    textAlign: "center",
    fill: am5.color(0xffffff),
  }),
);

// Mock stresi
var stressValue = stressData;

axisDataItem.set("value", stressValue);
label.set("text", stressValue.toString());

// Värit
var bands = [
  { from: 12, to: 30, color: 0xee1f25 }, // Huono 0xb0d136
  { from: 10, to: 12, color: 0xfdae19 }, // hyvä
  { from: 0, to: 10, color: 0xb0d136 }, //Erittäin hyvä
];

bands.forEach(function (band) {
  var range = xAxisGauge.createAxisRange(
    xAxisGauge.makeDataItem({
      value: band.from,
      endValue: band.to,
    }),
  );

  range.get("axisFill").setAll({
    visible: true,
    fill: am5.color(band.color),
    fillOpacity: 0.85,
  });
});

stressChart.appear(1000, 100);


/* STRESS GAUGE/PNS-index */

var stressRoot = am5.Root.new("physiologicalGauge");

stressRoot.setThemes([am5themes_Animated.new(stressRoot)]);

var stressChart = stressRoot.container.children.push(
  am5radar.RadarChart.new(stressRoot, {
    panX: false,
    panY: false,
    startAngle: 160,
    endAngle: 380,
  }),
);

var axisRenderer = am5radar.AxisRendererCircular.new(stressRoot, {
  innerRadius: -30,
});

var xAxisGauge = stressChart.xAxes.push(
  am5xy.ValueAxis.new(stressRoot, {
    min: 0,
    max: userInfo.age + 20,
    strictMinMax: true,
    renderer: axisRenderer,
  }),
);

var axisDataItem = xAxisGauge.makeDataItem({});

var hand = am5radar.ClockHand.new(stressRoot, {
  radius: am5.percent(95),
  bottomWidth: 10,
});

axisDataItem.set("bullet", am5xy.AxisBullet.new(stressRoot, { sprite: hand }));

xAxisGauge.createAxisRange(axisDataItem);

var label = stressChart.radarContainer.children.push(
  am5.Label.new(stressRoot, {
    centerX: am5.percent(50),
    centerY: am5.percent(50),
    fontSize: "35px",
    fill: am5.color(0xffffff),
  })
);

// Mock stresi
var stressValue = physiologicalData;


axisDataItem.set("value", stressValue);
label.set("text", stressValue.toString());

// Värit

var bands = [
  { from: userInfo.age + 5, to: userInfo.age + 15, color: 0xee1f25 }, // Huono 0xb0d136
  { from: userInfo.age, to: userInfo.age + 5, color: 0xfdae19 }, // hyvä
  { from: 0, to: userInfo.age, color: 0xb0d136 }, //Erittäin hyvä
];

bands.forEach(function (band) {
  var range = xAxisGauge.createAxisRange(
    xAxisGauge.makeDataItem({
      value: band.from,
      endValue: band.to,
    }),
  );

  range.get("axisFill").setAll({
    visible: true,
    fill: am5.color(band.color),
    fillOpacity: 0.85,
  });
});

stressChart.appear(1000, 100);


// Headerin dialogi
const headerBtn = document.getElementById("SettingDialog");
const headerDialog = document.getElementById("headerDialog");
const closeHeaderDialog = document.getElementById("closeHeaderDialog");
const overlay = document.getElementById("dialogOverlay");
const saveSettings = document.getElementById("saveSettings");
const emailInput = document.getElementById("settingsEmail");
const passwordInput = document.getElementById("settingsPassword");
const startWeightInput = document.querySelector("input[name='start_weight']");
const birthYearInput = document.querySelector("input[name='birth_year']");

// Avaa dialogi
headerBtn.addEventListener("click", () => {
    headerDialog.show();
    overlay.style.display ="block";
});

// Sulje dialogi napista
closeHeaderDialog.addEventListener("click", () => {
    headerDialog.close();
    overlay.style.display ="none";
});

// Tallenna asetukset
saveSettings.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  const payload = {};

    if (emailInput.value.trim() !== "") {
        payload.email = emailInput.value.trim();
    }

    if (passwordInput.value.trim() !== "") {
        payload.password = passwordInput.value.trim();
    }

    if (startWeightInput.value !== "") {
        payload.start_weight = startWeightInput.value;
    }

    if (birthYearInput.value.trim() !== "") {
        payload.birth_year = birthYearInput.value;
    }

  try {
    const response = await fetch(`http://localhost:3000/api/users/${localStorage.getItem('userId')}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Virhe tallennuksessa:", data);
      return;
    }

    console.log("Asetukset tallennettu:", data);

    headerDialog.close();
    overlay.style.display = "none";
    
  } catch (err) {
      console.error("Virhe tallennuspyynnössä:", err);
  }
});


// headerin username
const usernameSpan = document.getElementById("headerUsername");

if (userInfo && userInfo.username) {
  usernameSpan.textContent = userInfo.username;
} else {
  usernameSpan.textContent = "User"; // fallback
}



/* HRV graafin analyysi dialogi */

const hrvCard = document.getElementById("hrvchart");
const hrvDialog = document.getElementById("hrvDialog");
const closeHrvDialog = document.getElementById("closeHrvDialog");
const printHRV = document.getElementById("printHRV");

let hrvLargeRoot = null;


// Dialogien sulku klikkaamalla dialogien ulkopuolelta
overlay.addEventListener("click", () => {
  if (headerDialog.open) {
    headerDialog.close();
  }

  if (hrvDialog.open) {
    hrvDialog.close();

    if (hrvLargeRoot) {
      hrvLargeRoot.dispose();
      hrvLargeRoot = null;
    }
  }

  overlay.style.display = "none";
});

hrvCard.addEventListener("click", () => {
  updateHrvRecommendation();
  hrvDialog.show();
  overlay.style.display = "block";

  if (hrvLargeRoot) {
    hrvLargeRoot.dispose();
  }

  hrvLargeRoot = am5.Root.new("hrvchartLarge");

  hrvLargeRoot.setThemes([
    am5themes_Animated.new(hrvLargeRoot),
    am5themes_Responsive.new(hrvLargeRoot)
  ]);

  const chart = hrvLargeRoot.container.children.push(
    am5xy.XYChart.new(hrvLargeRoot, {
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true
    })
  );

  const xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(hrvLargeRoot, {
      baseInterval: { timeUnit: "day", count: 1 },
      renderer: am5xy.AxisRendererX.new(hrvLargeRoot, {})
    })
  );

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(hrvLargeRoot, {
      renderer: am5xy.AxisRendererY.new(hrvLargeRoot, {})
    })
  );


// HRV
const hrvSeries = chart.series.push(
 am5xy.LineSeries.new(hrvLargeRoot, {
 name: "HRV",
 xAxis,
 yAxis,
 valueXField: "date",
 valueYField: "hrv",
 stroke: am5.color(0x2563eb),
 })
);

hrvSeries.strokes.template.setAll({
  stroke: am5.color(0x000000),
  strokeWidth: 3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

hrvSeries.states.create("hover", {
  strokeWidth: 6,
});

hrvSeries.data.setAll(window.hrvDataForDialog);


// Stress
const stressSeries = chart.series.push(
  am5xy.LineSeries.new(hrvLargeRoot, {
    name: "Stress",
    xAxis,
    yAxis,
    valueXField: "date",
    valueYField: "stress",
    stroke: am5.color(0xdc2626),
  })
);

stressSeries.strokes.template.setAll({
  strokeWidth: 3,
  strokeDasharray: [6, 4],   // näkyy katkoviivana
  strokeLinecap: "round"
});

stressSeries.states.create("hover", {
  strokeWidth: 5
});

stressSeries.data.setAll(window.hrvDataForDialog);


// Readiness
const readinessSeries = chart.series.push(
  am5xy.LineSeries.new(hrvLargeRoot, {
    name: "Readiness",
    xAxis,
    yAxis,
    valueXField: "date",
    valueYField: "readiness",
    stroke: am5.color(0x16a34a),
  })
);

readinessSeries.strokes.template.setAll({
  strokeWidth: 3,
  strokeLinecap: "round"
});

readinessSeries.states.create("hover", {
  strokeWidth: 5
});

readinessSeries.data.setAll(window.hrvDataForDialog);


// Legendat
const legend = chart.children.push(
  am5.Legend.new(hrvLargeRoot, {
    centerX: am5.percent(50),
    x: am5.percent(50)
  })
);

legend.labels.template.setAll({
  fontSize: 14,
  fontWeight: "500",
  fill: am5.color(0x000000)
});

legend.data.setAll(chart.series.values);


xAxis.get("renderer").labels.template.setAll({
  fontSize: 15
});

yAxis.get("renderer").labels.template.setAll({
  fontSize: 15
});

hrvSeries.data.setAll(window.hrvDataForDialog);
stressSeries.data.setAll(window.hrvDataForDialog);
readinessSeries.data.setAll(window.hrvDataForDialog);


chart.appear(1000, 100);
});

closeHrvDialog.addEventListener("click", () =>{
  hrvDialog.close();
  overlay.style.display = "none";

  if (hrvLargeRoot) {
    hrvLargeRoot.dispose();
    hrvLargeRoot = null;
  }
});

printHRV.addEventListener("click", () => {
  window.print();
});

});





///////HUOM HUOM HUOM!  Siirretty diaryentries entrydialog.js:ään
/// jotta vähemmän koodia yhdessä tiedostossa ja helpompi hallita
