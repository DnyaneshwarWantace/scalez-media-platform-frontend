import React, { Component } from "react";
import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app

export default class ActionPlanTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [
        { title: "Chicken", children: [{ title: "Egg" }] },
        { title: "Fish", children: [{ title: "fingerline" }] },
      ],
    };
  }

  render() {
    return (
      <div style={{ height: 400 }}>
        <SortableTree isVirtualized={false} treeData={this.state.treeData} onChange={(treeData) => this.setState({ treeData })} />
      </div>
    );
  }
}
