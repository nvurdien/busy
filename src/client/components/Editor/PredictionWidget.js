/* eslint-disable react/jsx-no-bind */
import React from 'react';
import InfinityMenu from "react-infinity-menu";
import './PredictionWidget.less';
import predictionData from './predictionData'

class PredictionWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentWillMount() {
      const tree = [];
      try {
        predictionData.forEach((cate, i) => {
          tree.push({
            name: cate.category,
            id: i,
            isOpen: false,
            children: predictionData[i].events.map((event, j) => ({
              name: event.name.toString(),
              id: j,
              isOpen: false,
              children: predictionData[i].events[j].lines.map((line, k) => {
                if(line.type.toString() === "total"){
                  return {
                    name: `${  line.choice.toString() } ${ line.number.toString()} (${line.odds.toString()})`,
                    id: k,
                  }
                }
                else if(line.type.toString() === "spread"){
                  if(line.number > 0)
                    return {
                      name: `${  line.choice.toString() } +${ line.number.toString()} (${line.odds.toString()})`,
                      id: k,
                    }
                  return {
                    name: `${  line.choice.toString() } -${ line.number.toString()} (${line.odds.toString()})`,
                    id: k,
                  }
                }
                return {
                  name: `${  line.choice.toString() } (${line.odds.toString()})`,
                  id: k,
                }

              }),
            })),
          });
        });
        this.setState({
          tree
        });
      }
      catch(error){
        console.log("error");
      }
  }

  onNodeMouseClick(event, tree) {
    this.setState({
      tree
    });
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>
    }
    return (
      <div>
        <h3>Prediction Widget</h3>
        <InfinityMenu
          tree={this.state.tree}
          onNodeMouseClick={this.onNodeMouseClick.bind(this)}
          maxLeaves={100}
        />
      </div>
    );
  }
}

export default PredictionWidget;
