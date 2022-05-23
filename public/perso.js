
let taille_selected = false;
let nb_ingr_selected = 0;
let prix_ingr = 1.5;
let ingr_selected = new Map();


function gen_bar_choice() {
    let persoContainer = $("#persoContainer");

    let card = '<div class="card" id="perso">'
                +  '<div class="card-header">'
                +      '<div class="progress" style="height: 32px">'
                +         '<div class="progress-bar progress-bar-striped progress-bar-animated" id="bar" role="progressbar" style="width: 33.33%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"><span id="barText">Taille</span></div>'
                +      '</div>'
                +  ' </div>'
                + '</div>';

    persoContainer.append(card);
    
    
}

function is_taille_auto(taille, taille_auto) {
    for(let i = 0; i < taille_auto.length; i++) {
        if(taille_auto[i] === taille) return true;
    }
    return false;
}

function gen_taille_choice(taille, taille_select, taille_auto) {
    let perso = $("#perso");
    let div = "<div class='card-body' id='taille'>" +
                "<div class='row'>";
    for(let i = 0; i < taille.length; i++) {
        div += "<div class='col-4'>"
        div += "<div class='card" 
        + (taille_auto === undefined || is_taille_auto(taille[i].nom, taille_auto) ? " img-hover choice choice-taille " : " not-select ") 
        + (taille_select !== undefined && taille_select === taille[i].nom ? "active" : "") 
        + " mb-4'  prix='" + taille[i].prix + "' nom='" + taille[i].nom + "'>";
        div += "<img class='card-img-top' src='" + taille[i].image_url + "' alt='medium'></img>";
        div += "<div class='card-body'><h5 class='card-title text-center'>" + taille[i].nom + "</h5></div>";
        div += "</div></div>";
    }

    div += "</div></div>";
    perso.append(div);
}

function gen_ingr_choice(ingr, ingr_select) {
    let perso = $("#perso");

    let div = "<div class='card-body' id='ingr'>" +
                "<div class='row'>";
    for(let i = 0; i < ingr.length; i++) {
        div += "<div class='col-sm-6 col-md-6 col-lg-3 col-12'><div class='card choice choice-ingr img-hover'>";
        div += "<img class='card-img-top' src='" + ingr[i].image_url + "' alt='medium'></img>";
        div += "<div class='card-body elt'>" + "<p class='nom-ingr'>" + ingr[i].nom + "</p>" + "<p class='prix-ingr'>Gratuit</p>" + "</div>";
        div += "<div class='btn-group btn-group-justified' role='group'>"

        div += "<button type='button' class='btn btn-success add-elt'>+</button>"
        //div += "<div style='width=100%'>" + 0 + "</div>"
        let nb = 0;
        if(ingr_select !== undefined) {
            nb = ingr_select.get(ingr[i].nom);
            if(nb === undefined) nb = 0;
        }
        div += "<button type='button' class='btn count'>" + nb +"</button>"
        div += "<button type='button' class='btn btn-danger remove-elt'>-</button>"
        div += "</div>";
        div += "</div></div>";
    }

    div += "</div></div>";

    perso.append(div);
}

function gen_valid_choice(url,menu) {
    let perso = $("#perso");

    let div = "<div class='card-body text-center' id='valid'>";
    div += "<div id='recap'></div>"
    div += "<button type='button' id='valid-button' class='btn btn-primary'>Valider</button>" + "</div>";

    perso.append(div);

    $("#valid-button").click(function() {
        if(nb_ingr_selected > 0) {
            let prix_pizza = parseInt($(".choice-taille.active").attr("prix"));
            let prix_ingr_tot = Math.max((nb_ingr_selected - 3) * prix_ingr,0);
            let prix = prix_pizza + prix_ingr_tot;

            let ingr = "";
            let real_ingr = new Map();
            for(elt of ingr_selected) {
                if(elt[1] !== 0) {
                    ingr += elt[1] + " " + elt[0] + ", ";
                    real_ingr.set(elt[0], elt[1]);
                }
            }
            ingr = ingr.substring(0, ingr.length - 2);

            let o = {name: "Pizza Personnalisée", type:"pizzas" ,price: prix, menu: false, choice: $(".choice-taille.active").attr("nom") + " + " + ingr,taille: $(".choice-taille.active").attr("nom"), ingr: Array.from(real_ingr), number:1};
            
            if(menu === undefined){
                panier.push(o);
                update_panier();
                current_block.block.fadeOut("slow", function() {
                    current_block.block = $("#grille");
                    $("#grille").fadeIn("slow");
                });
            } else {
                console.log(menu);
                menu.elts.push(o);
                nextMenuStep(url,menu);
            }
        }
    });
}

function gen_footer_choice(isSelect) {

    let footer = "<div class='card-footer'>";
    footer += "<button type='button' id='prev' class='btn btn-outline-dark disabled'>Precedent</button>"
    footer += "<button type='button' id='next' class='btn btn-outline-success" + (isSelect ? "" : " disabled") + "'>Suivant</button>"
    footer += "<div class='text-right' id='prix-perso' style='float: right;'>Prix : 0€</div>"
    footer += "</div>";

    $("#perso").append(footer);
}
 
function switch_slide(b1, b2) {
    b1.slideToggle(500, function() {
        b2.slideToggle(500);
    })
}

function update_price(nb_ingr, prix_ingr) {
    let prix_pizza = parseInt($(".choice-taille.active").attr("prix"));
    console.log(prix_pizza);
    let prix_ingr_tot = Math.max((nb_ingr - 3) * prix_ingr,0);
    let prix = prix_pizza + prix_ingr_tot;
    $('#prix-perso').text("Prix : " + prix + "€");
}

function init_choice_taille_button() {
    $(".choice-taille").click(function() {
        taille_selected = true;
        $(".choice-taille").removeClass("active");
        $(this).addClass("active");
        $("#next").addClass("activ").removeClass("disabled");
        update_price(nb_ingr_selected, prix_ingr);
        
    });
}

function init_add_elt_button() {
    $(".add-elt").click(function() {
        if(nb_ingr_selected < 6) {
            let elt = $(this).parent().find(".count");
            let ingr = $(this).parent().parent().find(".nom-ingr");
            let n = ingr_selected.get(ingr.text());
            if(n === undefined) ingr_selected.set(ingr.text(), 1);
            else ingr_selected.set(ingr.text(), n + 1);
            nb_ingr_selected++;
            if(nb_ingr_selected >= 3) {
                $(".prix-ingr").text(prix_ingr + "€");
            }

            let nb = parseInt(elt.text());
            nb += 1;
            elt.text(nb);

            update_price(nb_ingr_selected, prix_ingr);
        }
    });
}



function init_rm_elt_button() {
    $(".remove-elt").click(function() {
        let elt = $(this).parent().find(".count");
        let ingr = $(this).parent().parent().find(".nom-ingr");

        let nb = parseInt(elt.text());
        if(nb !== 0) {

            let n = ingr_selected.get(ingr.text());
            if(n === 1) {
                ingr_selected.delete(ingr.text());
            }
            if(n !== undefined) ingr_selected.set(ingr.text(), n - 1);

            nb_ingr_selected--;
            if(nb_ingr_selected <= 2) {
                $(".prix-ingr").text("Gratuit");
            }
            nb--;
            elt.text(nb);
            update_price(nb_ingr_selected, prix_ingr);
        }
    }); 
}

function init_next_choice_button() {
    $("#next").click(function(){
        if(taille_selected) {
            if($("#bar").text() === "Taille") {
                $("#prev").removeClass("disabled");
                moveBar("+=33.33%", "Ingrédients");
                switch_slide($("#taille"), $("#ingr"));
            } else if($("#bar").text() === "Ingrédients"){
                moveBar("+=33.33%", "Validation"); 

                div = "<p>" + $(".choice-taille.active").attr("nom") + "</p>";
                for(elt of ingr_selected) {
                    if(elt[1] !== 0) div += "<p>" + elt[1] + " x " + elt[0] + "</p>";
                }

                $("#recap").empty().append(div);
                switch_slide($("#ingr"), $("#valid"));
                $(this).addClass("disabled");
            }
        }
    });
}

function init_prev_choice_button() {
    $("#prev").click(function() {
        if($("#bar").text() === "Taille") return;
        if($("#bar").text() === "Ingrédients") {
            moveBar("-=33.33%", "Taille");
            switch_slide($("#ingr"), $("#taille"));
            $(this).addClass("disabled");
        } else {
            moveBar("-=33.33%", "Ingrédients");
            switch_slide($("#valid"), $("#ingr"));
            $("#next").removeClass("disabled");
        }
    });
}

function init_perso(url,current_block,taille_select, ingr_select, menu) {
    console.log("PERSO");
    console.log(url);
    $.get(url + "ingr", {}, (ingr) => {
        $.get(url + "taille", {}, (taille) => {
            $("#grille").fadeOut("slow", function() {
                console.log(taille);
                console.log(ingr);
                current_block.block = $("#persoContainer");
                taille_selected = (taille_select !== undefined);
                nb_ingr_selected = 0;
                if(ingr_select !== undefined) {
                    for(elt of ingr_select) {
                        nb_ingr_selected += elt[1];
                    }
                }
                if(ingr_select === undefined) ingr_selected = new Map();
                else ingr_selected = ingr_select;

                console.log(taille_select);
                console.log(ingr_select);

                $("#persoContainer").empty();
                gen_bar_choice();
                gen_taille_choice(taille, taille_select,(menu === undefined ? undefined : menu.format.tailles_pizza));
                gen_ingr_choice(ingr, ingr_select);
                gen_valid_choice(url,menu);
                gen_footer_choice(taille_selected);

                $("#ingr").hide();
                $("#valid").hide();
                
                init_choice_taille_button();
                init_add_elt_button();
                init_rm_elt_button();
                init_next_choice_button();
                init_prev_choice_button();

                if(taille_select) update_price(nb_ingr_selected, prix_ingr);
                if(nb_ingr_selected >= 3) {
                    $(".prix-ingr").text(prix_ingr + "€");
                } else {
                    $(".prix-ingr").text("Gratuit");
                }

                $("#persoContainer").fadeIn("slow");
            });
        });
    });
}