function validatePUI(puiName) {
    let matchObj = puiName.match(/^[A-Z]{3}\d{6}$/)
    return matchObj != null
}

module.exports = validatePUI
