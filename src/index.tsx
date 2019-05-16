import * as ui from "hyperoop";


class MainController extends ui.Actions<{angle: number}> {
    constructor() {
        super({angle: 0});
    }
}

const mainController = new MainController();

async function main() {

    const MainDiv = () => {
        return  <div class="uk-panel uk-margin-large-top">
                    <img class="uk-align-center uk-margin-large-top"        
                         src="./img/logo.png" 
                         style={`transform: rotate(${mainController.State.angle}deg)`} />
                </div>
    }

    ui.init(document.getElementById("main"), MainDiv, mainController);

    setInterval(()=>{
        mainController.State.angle += 1;
    }, 1000./30)
}

main();