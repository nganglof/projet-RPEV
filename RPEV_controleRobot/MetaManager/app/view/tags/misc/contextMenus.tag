<contextMenus>
    <div id="photon_cm" class="cm">
        <nav class="nav-group">
            <a class="nav-group-item cm__link">
                <span class="icon icon-pencil"></span>
                Edit
            </a>
            <a class="nav-group-item cm__link">
                <span class="icon icon-cancel"></span>
                Delete
            </a>
            <a class="nav-group-item cm__link">
                <span class="icon icon-upload"></span>
                Send data
            </a>
        </nav>
    </div>

    <style>
        .cm {
            display: none;
            position: absolute;
            z-index: 10;
            background-color: #f5f5f4;
            width: 200px;
            border: 1px solid black;
        }

        .cm--active {
            display: block;
        }

        .cm__link:hover {
            background-color: #dcdfe1;
        }
    </style>
</contextMenus>