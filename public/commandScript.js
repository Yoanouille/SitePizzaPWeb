//Fonction qui modifie les valeurs des infos de la commande sur la page selon les valeurs stockées dans command
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

//Fonction qui affiche le panier de la commande sur la page
function setPanier(panier) {
    $("#commandContainer").html(gen_panier(panier, true));
    $("[data-toggle=tooltip]").tooltip();
}

//Quand le document est prêt, on envoie une requête au serveur pour récupérer une commande et l'afficher
$("document").ready(function() {
    $("#block1").hide();
    $.get("/commande", {}, (data) => {
        console.log(data);
        setPanier(data.panier);
        setCommandInfo(data);
        $("#block1").show();
        $("#commandId").val(data.id);

        $("#noCommand").hide();
    });
});
