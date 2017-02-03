<wfooter>
    <footer class="toolbar toolbar-footer">
        <h1 class="title">{ name }</h1>
    </footer>

    <script>
        var Renderer = require('./../Renderer').Renderer;
        var self = this;

        this.name = opts.name;



        document.addEventListener("windowChanged", function(e){
            self.update({name: Renderer.currentWindow()});
        });

    </script>

    <style>
    </style>
</wfooter>