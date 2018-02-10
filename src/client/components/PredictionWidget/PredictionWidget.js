/* eslint-disable react/jsx-no-bind */
import React from 'react';
import InfinityMenu from '../InfinityMenu/InfinityMenu';
import './PredictionWidget.less';
import predictionData from './PredictionWidgetData';

class PredictionWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentWillMount() {
    const tree = [];
    let val = 0;
    try {
      predictionData.forEach((cate, i) => {
        val += 1;
        tree.push({
          name: cate.category,
          id: val,
          isOpen: false,
          children: predictionData[i].events.map((event, j) => ({
            name: event.name.toString(),
            id: val + 1,
            isOpen: false,
            children: predictionData[i].events[j].lines.map(line => {
              val += 1;
              val += 1;
              if (line.type.toString() === 'total') {
                return {
                  name: `${line.choice.toString()} ${line.number.toString()} (${line.odds.toString()})`,
                  id: val,
                };
              } else if (line.type.toString() === 'spread') {
                if (line.number > 0)
                  return {
                    name: `${line.choice.toString()} +${line.number.toString()} (${line.odds.toString()})`,
                    id: val,
                  };
                return {
                  name: `${line.choice.toString()} -${line.number.toString()} (${line.odds.toString()})`,
                  id: val,
                };
              }
              return {
                name: `${line.choice.toString()} (${line.odds.toString()})`,
                id: val,
              };
            }),
          })),
        });
      });

      // predictionData.forEach((cate, i) => {
      //   predictionData[i].events.forEach((event, j) => {
      //     val++;
      //     tree.push({
      //       name:event.name.toString(),
      //       id: val,
      //       isOpen: false,
      //       children: predictionData[i].events[j].lines.map((line, k) => {
      //         val++;
      //         if(line.type.toString() === "total"){
      //           return {
      //             name: `${  line.choice.toString() } ${ line.number.toString()} (${line.odds.toString()})`,
      //             id: val,
      //           }
      //         }
      //         else if(line.type.toString() === "spread"){
      //           if(line.number > 0)
      //             return {
      //               name: `${  line.choice.toString() } +${ line.number.toString()} (${line.odds.toString()})`,
      //               id: val,
      //             };
      //           return {
      //             name: `${  line.choice.toString() } -${ line.number.toString()} (${line.odds.toString()})`,
      //             id: val,
      //           }
      //         }
      //         return {
      //           name: `${  line.choice.toString() } (${line.odds.toString()})`,
      //           id: val,
      //         }
      //       })
      //     })
      //   });
      // });

      this.setState({
        tree,
      });
    } catch (error) {
      console.log('error');
    }
  }

  onNodeMouseClick(event, tree) {
    this.setState({
      tree,
    });
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>;
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
