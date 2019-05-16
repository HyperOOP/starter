import * as ui from "hyperoop";

class MainController extends ui.Actions<{angle: number}> {
    constructor() {
        super({angle: 0});
    }
}

const mainController = new MainController();

const MainDiv = (angle: number) => () => (
    <div class="logo">
        <img src="./img/logo.png" />
    </div>
)

ui.init(document.getElementById("main"), MainDiv(0), mainController);
