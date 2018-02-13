/* eslint-disable react/jsx-no-bind,react/prop-types */
import React from 'react';
// import './autocomplete-0.3.0';
import './PredictionWidget.less';
// import './autocomplete-0.3.0.css'
import predictionData from './PredictionWidgetData';
import InfinityMenu from '../InfinityMenu/InfinityMenu';

/* Added a autocomplete function for the new design */

class PredictionWidget extends React.Component {
  // sets up default values
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.value = '';
  }

  // mounts component with new data
  componentWillMount() {
    const tree = [];
    let val = 0;
    try {
      // creating the tree

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

      // sets the state of the value
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

  // creates the html for the site
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
        {this.state.value}

        {this.props.children}
      </div>
    );
  }
}

export default PredictionWidget;
