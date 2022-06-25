export function cleanData(data) {
    data.username = data.username.replace(/(<([^>]+)>)/ig, '');
    return data;
}

export function validate(data) {
    var str = data.password;
    var str2 = data.passwordConfirm;
    if (str != str2) {
        return false
    }

    if (str.match(/[0-9]/g) &&
        str.match(/[A-Z]/g) &&
        str.match(/[a-z]/g) &&
        str.match(/[^a-zA-Z\d]/g) &&
        str.length >= 12) {
        return true;
    }
    else {
        console.log("validate false")
        return false
    }
}

export function checkEmail(data) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (data.match(mailformat)) {
        return true;
    }
    else {
        alert("Vous avez saisi une adresse électronique non valide !");
        return false;
    }
}