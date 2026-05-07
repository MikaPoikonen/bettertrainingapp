/**
 * // yleistiedot
 * fetchData() on yleiskäyttöinen funktio, joka suorittaa HTTP-pyynnön annettuun URL-osoitteeseen ja palauttaa 
 * JSON-muodossa olevan vastauksen. Se käsittelee sekä onnistuneet että epäonnistuneet pyynnöt, ja palauttaa virheilmoituksen tarvittaessa.
 *
 * @param {string} url - api endpoint url
 * @param {Object} options - request options
 *
 * @returns {Object} response json data
 */
const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "An error occurred" };
    }
    return await response.json(); // Return successful response data
  } catch (error) {
    console.error("fetchData() error:", error.message);
    return { error: error.message };
  }
};

export { fetchData };
