var isJobsPage = false;
var NewWorklist = {
    init: function() {

        if($( window ).width() <= '450'){
            $(".dropdown-navmenu").on('hover, touchstart', function(){
                $('body').css('overflow', 'hidden');
            });
            $("body > section").hover(function(){
                $('body').css('overflow', 'auto');
            });
        }

        $(document).ajaxSend(function(event, request, settings) {
            if (settings.url == './status' && settings.type.toUpperCase() == 'POST') {
                return;
            }
            $('body').addClass('onAjax');
        });    
        $(document).ajaxComplete(function() {
            $('body').removeClass('onAjax');
        });

        $('a[href^="./github/login"]').click(NewWorklist.loginClick);

        /**
         * Initialize js objects used by worklist
         * previously wrapped on jQuery.load functions
         */
        Budget.init();
        UserStats.init();
        NewWorklist.initMentions();
        NewWorklist.initJobSearch();
    },

    loginClick: function(event) {
        event.preventDefault();

        var href = $(this).attr('href');

        var doNotShowGithubNote = false;

        // Try to get localStorage value, but if it's not available in this browser, use the default value of `false`
        try {
            doNotShowGithubNote = localStorage.getItem('doNotShowGithubNote');
        } catch(e) {
        }

        if (doNotShowGithubNote) {
            window.location = href;
        } else {
            var message = "<strong>We do require access to private repositories</strong>, "
                + "but only those that @highfidelity manages. We will not read or write to your "
                + "private repositories that weren't forked from @highfidelity."
                + "<br><br><label><input type='checkbox' name='doNotShow'> Do not show this message again</input></label>";
            Utils.emptyModal({
                title: "GitHub Authentication",
                content: message,
                buttons: [{
                    type: 'button',
                    content: 'Log in with GitHub',
                    className: 'btn-primary',
                    dismiss: true
                }],
                close: function(el) {
                    var selected = $(el).find('input[name="doNotShow"]')[0].checked;
                    if (selected) {
                        try {
                            localStorage.setItem('doNotShowGithubNote', 'true');
                        } catch(e) {
                        }
                    }
                    window.location = href;
                },
            });
        }
    },

    initMentions: function() {
        $('.mentions').mention({
            delimiter: '@',
            sensitive : true,
            queryBy: ['name, nickname, username'],
            ajax : true,
            ajaxUrl : 'user/mentionsList',
            users: [{ }]
        });    
    },

    initJobSearch: function() {
        $('#search-query input[type="text"]').keypress(function(event) {
            if ($.trim($(this).val()).length > 0 && event.keyCode == '13') {
                if(!isJobsPage) {
                    window.location = "./jobs?query=" + $(this).val();
                }
            }
        });
        $("#query-search-button").click(function() {
            if($.trim($('#search-query input[type="text"]').val()).length > 0 && !isJobsPage) {
                    window.location = "./jobs?query=" + $('#search-query input[type="text"]').val();
            }
        });
    }
}
