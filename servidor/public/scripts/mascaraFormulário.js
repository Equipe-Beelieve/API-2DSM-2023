function cnpj(i){
    var v =i.value;
    if(isNaN(v[v.length-1])){//impede de entrar qualquer coisa além de número
        i.value = v.substring(0, v.length-1);
        return;
    }
    
    i.setAttribute("maxlength", "18");
    if(v.length == 2) i.value += ".";
    if(v.length == 6) i.value += ".";
    if(v.length == 10) i.value += "/";
    if(v.length == 15) i.value += "-";
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