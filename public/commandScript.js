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
