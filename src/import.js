function importJS() {
    if (! new Array().push) return false;

    var scripts = new Array(
        '/home/common/js/jquery-1.4.3.min.js'
    );
    for (var i=0; i<scripts.length; i++) {
        document.write('<script type="text/javascript" src="' +scripts[i] +'" charset="utf-8"><¥/script>');
    }
}
importJS();