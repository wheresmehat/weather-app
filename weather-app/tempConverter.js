function convertFtoC(tempStr) {
    
    var reg = /(\d+)°F/; 
    
    function replacer(match, p1) {
    
        let cel = (p1 - 32) * 5/9;
    
        return cel.toFixed(1) + "°C" ;  
    }

    var newTempStr = tempStr.replace(reg, replacer);

    return newTempStr;
    
}

module.exports = {

    convertFtoC
}