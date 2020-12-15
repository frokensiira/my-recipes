import React from 'react';
import linsgrytaImage from '../images/dhal-indisk-linsgryta-980x515-c.jpg';

const RecipeCard = () => {
    return (
        <div>
            <div className="card">
                <img src={linsgrytaImage} className="card-img-top" alt="Indisk linsgryta"/>
                <div className="card-body">
                    <h5 className="card-title">Dahl, indisk linsgryta</h5>
                    <p className="card-text">För dig som gillar indisk mat kommer den här dhalen bli en favorit. Linsgrytan är fylld med rika kryddor som koriander, ingefära, kummin och kanel och serverad med färskt naanbröd och ris är rätten komplett. </p>
                    <a href="https://www.ica.se/recept/dhal-indisk-linsgryta-614423/?fbclid=IwAR2Ys4fDo_Zck5SO1OHJtwsD3-RoK1Mp3HMLXQDekCQUMPfVRRQbJ0R8ns0" target="_blank" rel="noreferrer"
                    className="btn btn-primary">Till receptet</a>   
                </div>
            </div>
        </div>
    )
}

export default RecipeCard;
