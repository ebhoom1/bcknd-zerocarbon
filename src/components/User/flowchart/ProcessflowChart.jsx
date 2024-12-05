
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProcessFlows } from "../../../redux/features/boundarySlice/ProcessFlowSlice";
import ReactFlow, { Background, Controls } from "react-flow-renderer";
import { Tooltip,Button } from "@mui/material";

const ProcessFlowChart = () => {
  const dispatch = useDispatch();

  const { processFlows, status, error } = useSelector((state) => state.processFlow);

  useEffect(() => {
    dispatch(fetchProcessFlows());
  }, [dispatch]);

  if (status === "loading") return <div>Loading process flow chart...</div>;
  if (status === "failed") return <div>Error: {error}</div>;
  if (processFlows.length === 0) return <div>No process flows available.</div>;

  const { nodes, edges } = processFlows[0];

  const renderNodeLabel = (node) => {
    if (node.data.fieldName === "name" && node.data.scopeDetails.length > 0) {
      const scopeDetails = node.data.scopeDetails.map((scope, index) => (
        <div key={index}>
          <strong>Category:</strong> {scope.category}
          <br />
          <strong>Scope Type:</strong> {scope.scopeType}
          <br />
          <strong>Subcategory:</strong> {scope.subCategory}
          <br />
          <strong>Emission Factor:</strong> {scope.emissionFactor}
          <br />
          <strong>Units:</strong> {scope.units}
          <br />
          <strong>Comments:</strong> {scope.comments}
          <hr />
        </div>
      ));

      return (
        <Tooltip title={<div style={{ maxWidth: 300 }}>{scopeDetails}</div>} arrow>
          <div style={{ cursor: "pointer" }}>{node.data.label}</div>
        </Tooltip>
      );
    }
    return <div>{node.data.label}</div>;
  };

  return (
    <div style={{ height: "80vh", width: "100%" ,position: "relative" }}>
        <Button
        variant="contained"
        color="primary"
       
        style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}
      >
        Update
      </Button>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            label: renderNodeLabel(node),
          },
        }))}
        edges={edges}
        fitView
      >
        <Background color="#aaa" gap={16} />
        {/* Uncomment MiniMap if needed */}
        {/* <MiniMap /> */}
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default ProcessFlowChart;

