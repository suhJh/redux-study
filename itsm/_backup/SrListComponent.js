(function (exports, $, Controller) {

    

    var SrContainer = Controller.create({
        elements: {
            '#sr_all_btn': 'srAllBtn',
            '#sr_process_btn': 'srProcessBtn',
            '#sr_completed_btn': 'srCompletedBtn'
        },
        events: {
            'click #sr_all_btn, #sr_process_btn, #sr_process_btn': 'onClickFilterBtn',
        },
        init() {
        },
        onClickFilterBtn(e) {

        },
    });

    exports.Conponents = _.extend({}, exports.Components, { SrContainer: SrContainer });

})(window, jQuery, window.Controller);