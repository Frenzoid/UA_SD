import { Component } from "react";

class Square extends Component {

    render() {
        return (
            <div
                style={{ backgroundColor: this.props.color, minWidth: "5%", minHeight: "50px", textAlign: "center", color: "white" }}
                onClick={() => { this.props.updateCell(this.props.i, this.props.j) }}
            >
                {this.props.i}, {this.props.j}
            </div >
        )
    }
}

export default Square;