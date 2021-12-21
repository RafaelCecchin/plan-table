const bpTablet = 1050;
const bpSmartphone = 700;
const bpSmall = 550;

const table = $(".table");
const plans = $(".plans");
const colPlanos = plans.find(".col");
const colRecursos = $(".resources .col");
const recursos = colRecursos.children();

const leftArrow = $(".arrows .left-arrow");
const rightArrow = $(".arrows .right-arrow");

function getResourceWidth() {
    return colRecursos.parent().outerWidth();
}

function updateDataSize() {

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
        
            let col = $(this);
            let windowWidth = $(window).width();
            let plansWidth = plans.width();

            if (windowWidth < bpSmall) {
                col.width((plansWidth)+"px");
            } else if (windowWidth < bpTablet) {
                col.width((plansWidth/2)+"px");
            } else if (windowWidth >= bpTablet) {
                col.width("unset");
            } 

            let recursosDoPlano = $(this).find(".data");
            recursosDoPlano.each(function () {
    
                let recursoDoPlano = $(this);
                let indexRecursoDoPlano = recursoDoPlano.index() - 1; // do not count the header

                if (indexRecurso == indexRecursoDoPlano) {
                    recursoDoPlano.css("max-height", recursoHeight+"px");

                    let linhasPlanos = recursoDoPlano.children();
                
                    linhasPlanos.each(function ( index ) {
                        $(this).innerHeight( linhasRecursos.eq(index).innerHeight() );
                    });
                }
                
                
            });
        });
    });

    scroll();
}

function closeAllData() {
    
    recursos.each(function () {

        let recurso = $(this);
        let newRecursoHeight = recurso.children().first().outerHeight();

        recurso.css("max-height", newRecursoHeight+"px");
        recurso.addClass("closed");

        colPlanos.each(function () {

            let recursosDoPlano = $(this).find(".data");
            
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

        let recursosDoPlano = $(this).find(".data");
        let recursoAtual = recursosDoPlano.eq(index);

        recursoAtual.css("max-height", newRecursoHeight+"px");
    });

    recurso.toggleClass("opened");
    recurso.toggleClass("closed");
    
}

function scroll(event) {
    let eventDirection = event ? event.data.direction : null;
    let containerPosition = table.offset().left + getResourceWidth();
    let closer;
    let newScroll = 0;

    /* Esse foreach serve para definir a *
    *  coluna de plano que está na visão *
    *  do usuário no momento             */
    colPlanos.each(function () {
        let plan = $(this);
        let planPosition = containerPosition - plan.offset().left;
        let closerPosition = containerPosition - (closer != null ? closer.offset().left : 0);

        if (Math.abs(planPosition) < Math.abs(closerPosition) || closer == null) {
            closerProximity = planPosition;
            closer = plan;
        }
    });

    
    /* Esse foreach serve para pegar a soma do       *
    *  tamanho das colunas anteriores ou posteriores */ 

    if (eventDirection == "right") {

        if (closer.next().length) {
            closer = closer.next();
        }

    } else if (eventDirection == "left") {

        if (closer.prev().length) {
            closer = closer.prev();
        }
        
    } 
    
    closer.prevAll().each(function() {
        newScroll += $(this).width();
    });

    if (event) {
        plans.animate({scrollLeft: newScroll});
    } else {
        plans.scrollLeft(newScroll);
    }
}

table.ready(function() {
    setTimeout(function() {
        updateDataSize();
        closeAllData();
    }, 50);
});

recursos.on("click", collapseData);
leftArrow.on("click",  {direction: "left"}, scroll);
rightArrow.on("click", {direction: "right"}, scroll);

$(window).resize(updateDataSize);