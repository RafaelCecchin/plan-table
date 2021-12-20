const table = $(".table");
const colPlanos = $(".plans .col");
const colRecursos = $(".resources .col");
const recursos = colRecursos.children();

function updateDataHeight() {

    recursos.each(function () {

        let recurso = $(this);
        let indexRecurso = recurso.index();

        if (recurso.hasClass("closed")) {
            recursoHeight =  recurso.children().first().outerHeight();
        } else {
            recursoHeight =  recurso.prop('scrollHeight');
        }

        recurso.css("max-height", recursoHeight+"px");
        let linhasRecursos = recurso.children();

        colPlanos.each(function () {

            let recursosDoPlano = $(this).children();

            recursosDoPlano.each(function () {
    
                let recursoDoPlano = $(this);
                let indexRecursoDoPlano = recursoDoPlano.index();

                if (indexRecurso == indexRecursoDoPlano) {
                    recursoDoPlano.css("max-height", recursoHeight+"px");
                }
                
                let linhasPlanos = recursoDoPlano.children();
                
                linhasPlanos.each(function ( index ) {
                    $(this).innerHeight( linhasRecursos.eq(index).innerHeight() );
                });
            });
        });
    });
}

function closeAllData() {
    
    recursos.each(function () {

        let recurso = $(this);
        let newRecursoHeight = recurso.children().first().outerHeight();

        recurso.css("max-height", newRecursoHeight+"px");
        recurso.addClass("closed");

        colPlanos.each(function () {

            let recursosDoPlano = $(this).children();
            
            recursosDoPlano.each(function () {
    
                $(this).css("max-height", newRecursoHeight+"px");

            });
        });
    });

}

function collapseData() {
    
    let recurso = $(this);
    let index = recurso.index();
    let newRecursoHeight;

    if (recurso.hasClass("closed")) {
        newRecursoHeight =  recurso.prop('scrollHeight');
    } else {
        newRecursoHeight =  recurso.children().first().outerHeight();
    }

    recurso.css("max-height", newRecursoHeight+"px");

    colPlanos.each(function () {

        let recursosDoPlano = $(this).children();
        let recursoAtual = recursosDoPlano.eq(index);

        recursoAtual.css("max-height", newRecursoHeight+"px");
    });

    recurso.toggleClass("opened");
    recurso.toggleClass("closed");
    
}

table.ready(function() {
    setTimeout(function() {
        updateDataHeight();
        closeAllData();
    }, 50);
});


recursos.on("click", collapseData);
$(window).resize(updateDataHeight);