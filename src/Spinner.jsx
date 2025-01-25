import { React } from "react";
import "./Spinner.css"
const Spinner = (props) =>{
    const height = props.height
    const width = props.width
    return(
        <div className="loader1" style={{height:height,width:width}}>
            <div className="loader"></div>
        </div>
    )
}

export default Spinner;