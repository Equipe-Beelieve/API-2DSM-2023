function cnpj(i){
    var v =i.value;
    if(isNaN(v[v.length-1])){//impede de entrar qualquer coisa além de número
        i.value = v.substring(0, v.length-1);
        return;
    }
    
    i.setAttribute("maxlength", "19");
    if(v.length == 3) i.value += ".";
    if(v.length == 7) i.value += ".";
    if(v.length == 11) i.value += "/";
    if(v.length == 16) i.value += "-";
}
    function cep(i){
        var v = i.value
        if(isNaN(v[v.length-1])){//impede de entrar qualquer coisa além de número
        i.value = v.substring(0, v.length-1);
        return;
    }
        i.setAttribute("maxlength", "9");
        if(v.length == 5) i.value += "-";
}

    function soNumero(i){
        var v = i.value
        if(isNaN(v[v.length-1])){//impede de entrar qualquer coisa além de número
        i.value = v.substring(0, v.length-1);
        return;
    }
    }