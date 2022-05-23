/*function gen_elt(elt){
    let s =
     '<li class="list-group-item d-flex justify-content-between align-items-center">'
    +   '<div><span class="name-panier">'+elt.name+'</span>';
            if(elt.choice !== undefined){
                s+=' <i class="bi-info-circle choice-panier" data-toggle="tooltip" data-placement="top" title="'+elt.choice+'" nom="' + elt.choice +'"></i>'
            }
    s +='</div><div><span class="badge badge-secondary">'+(elt.prix)+'€</span> <span class="badge badge-primary badge-pill badge-success">'+elt.number+'</span> '
    //+'<span class="badge badge-primary badge-pill badge-danger rm-panier">-</span>'
    +'</div>'
    +'</li>';
    return s;
}

function gen_menu_elt(elt){
    let s =
     '<div class="dropdown-item">'+elt.name;
            if(elt.choice !== undefined){
                s+=' <i class="bi-info-circle" data-toggle="tooltip" data-placement="top" title="'+elt.choice+'"></i>'
            }
    s +=' <span class="badge badge-primary badge-pill badge-success">'+elt.number+'</span>'
    +'</div>';
    return s;
}

function gen_menu(menu){
    let s =
     '<li class="list-group-item d-flex justify-content-between align-items-center">'
    +   '<div class="dropdown">'
    +      '<button class="btn btn-secondary dropdown-toggle bg-light text-dark" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
    +          menu.name
    +      '</button>'
    +      '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">';
    for(let elt of menu.elts){
            s += gen_menu_elt(elt);
    }
    s+=      '</div>'
    +   '</div>'
    +   '<div><span class="badge badge-secondary">'+menu.prix+'€</span></div>'
    +'</li>';
    return s;
}

function gen_panier(panier){
    let p =
     '<ul id="command" class="list-group shadow-sm">'
    +'<li class="list-group-item text-center"><h3>Commande</h3></li>';
        let totalPrice = 0;
        for(let elt of panier){
            totalPrice += elt.prix*elt.number;
            if(elt.type === "menus"){
                p += gen_menu(elt);
            } else {
                p += gen_elt(elt);
            }
        }
    p +=
    '<li class="list-group-item d-flex justify-content-between align-items-center"><span class="badge badge-secondary">Total: '+totalPrice+'€</span></li>'
    +'</ul>';
    return $(p);
}*/

function setCommandInfo(command){
    $("#Nom").val(command.nom);
    $("#Prenom").val(command.prenom);
    $("#addr").val(command.addr);
    if(command.code === ""){
        $("#codeContainer").hide();
    } else {
        $("#codeContainer").show();
        $("#code").val(command.code);
    }
    $("#num").val(command.num);
    $("#Email").val(command.email);
    $("#Time").val(command.heure);
}

function update_panier(panier) {
    $("#commandContainer").html(gen_panier(panier, true));
    $("[data-toggle=tooltip]").tooltip();
}

$("document").ready(function() {
    $("#block1").hide();
    $.get("/commande", {}, (data) => {
        console.log("dataa");
        console.log(data);
        update_panier(data.panier);
        setCommandInfo(data);
        $("#block1").show();
        $("#commandId").val(data.id);

        $("#noCommand").hide();
    });
});
