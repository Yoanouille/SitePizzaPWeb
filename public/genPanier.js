//Fonction qui génère le code html d'un élément dans le panier
//Si livraison est true, il n'y a pas de bouton pour supprimer l'élément
function gen_elt(elt, livraison){
    let s =
     '<li class="list-group-item d-flex justify-content-between align-items-center">'
    +   '<div><span class="name-panier">'+elt.name+'</span>';
            if(elt.choice !== undefined){
                s+=' <i class="bi-info-circle choice-panier" data-toggle="tooltip" data-placement="top" title="'+elt.choice+'" nom="' + elt.choice +'"></i>'
            }
    s +='</div><div><span class="badge badge-secondary">'+(Math.round(elt.price*100)/100)+'€</span> <span class="badge badge-primary badge-pill badge-success">'+elt.number+'</span>';
    if(!livraison) s += ' <span class="badge badge-primary badge-pill badge-danger rm-panier">-</span>';
    s +='</div></li>';
    return s;
}

//Fonction qui génère le code html d'un élément d'un menu dans le panier
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

//Fonction qui génère le code html d'un menu dans le panier
//Si livraison est true, il n'y a pas de bouton pour supprimer le menu
function gen_menu(menu, livraison){
    let s =
     '<li class="list-group-item d-flex justify-content-between align-items-center">'
    +   '<div class="dropdown">'
    +      '<button class="btn btn-secondary dropdown-toggle bg-light text-dark" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
    +          menu.name
    +      '</button>'
    +      '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">';
    //Pour chaque élément du menu, on génère son code htm pour l'ajouter au menu
    for(let elt of menu.elts){
            s += gen_menu_elt(elt);
    }
    s+=      '</div>'
    +   '</div>'
    +   '<div><span class="badge badge-secondary">'+menu.price+'€</span>';
    if(!livraison) s += ' <span class="panier-rm-menu badge badge-primary badge-pill badge-danger" > - </span>';
    s += '</div>'
    +'</li>';
    return s;
}

//Fonction qui construit l'élément html du panier à partir d'un tableau représentant le panier
//Si livraison est true, il n'y a pas de boutons pour supprimer les éléments ni pour commander
function gen_panier(panier, livraison){
    let p =
     '<ul id="panier" class="list-group shadow-sm">'
    +'<li class="list-group-item text-center"><h4>' + (livraison ? 'Commande' : 'Panier') + '</h4></li>';
        //Pour chaque élément du panier, on génère son code html et on ajoute son prix au prix total
        let totalPrice = 0;
        for(let elt of panier){
            totalPrice += elt.price*elt.number;
            if(elt.menu === true){
                p += gen_menu(elt, livraison);
            } else {
                p += gen_elt(elt, livraison);
            }
        }
    //On arrondit le prix total au centime près (pour éviter les erreurs d'arithmétique à virgule flottante)
    totalPrice = Math.round(totalPrice*100)/100;
    p += '<li class="list-group-item d-flex justify-content-between align-items-center">';
    if(!livraison){
        if(totalPrice === 0)
            p += '<button type="button" class="btn btn-success">Commander</button>';
        else
            p += '<button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#Modal">Commander</button>';
    }
    p += '<span class="badge badge-secondary">Total: '+totalPrice+'€</span></li></ul>';
    return p;
}