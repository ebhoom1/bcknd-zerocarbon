

// import React, { useEffect } from "react";
// import ReactFlow, {
//   addEdge,
//   Background,
//   Controls,
//   MiniMap,
//   useNodesState,
//   useEdgesState,
// } from "react-flow-renderer";
// import { Button, Popover, Typography } from "@mui/material";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchBoundaries } from "../../../redux/features/boundarySlice/BoundarySlice";
// import { saveProcessFlow } from "../../../redux/features/boundarySlice/ProcessFlowSlice";
// import { fetchProcessFlows } from "../../../redux/features/boundarySlice/ProcessFlowSlice";
// import axios from '../../../api/axios'; // For making HTTP requests



// const createNodes = (boundary, startIndex) => {
//   // Extract the keys and values dynamically
//   return Object.entries(boundary)
//     .filter(([fieldName]) => fieldName !== "_id" && fieldName !=="__v" && fieldName!=="scopes") // Exclude "_id"
//     .map(([fieldName, value], index) => {
//       return {
//         id: `node-${startIndex + index}`,
//         type: "default",
//         data: {
//           // label: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: ${value || "N/A"}`, 
//           label: typeof value === "string" ? value : JSON.stringify(value),// Format field name and value
//           boundaryId: boundary._id, // Add boundary ID to each node
//           fieldName,                // Use the key name as the field name
//         },
//         position: { x: 250 + index * 200, y: startIndex * 150 }, // Adjust positions dynamically
//       };
//     });
// };



// const ProcessFlowChart = () => {
//   const dispatch = useDispatch();
//   const processFlows = useSelector((state) => state.processFlow.processFlows);
//   const boundaries = useSelector((state) => state.boundaries.data);

//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);

//   // Fetch boundaries on component mount
//   useEffect(() => {
//     dispatch(fetchBoundaries());
//   }, [dispatch]);

//   // Update nodes when boundaries data changes
//   useEffect(() => {
//     if (boundaries?.length) {
//       const newNodes = boundaries.flatMap((boundary, index) =>
//         createNodes(boundary, index * 5)
//         );
//         setNodes(newNodes);
//       }
//       console.log(boundaries)
//   }, [boundaries]);

//   useEffect(() => {
//     dispatch(fetchProcessFlows());
//   }, [dispatch]);

//   useEffect(() => {
//     if (processFlows.length > 0) {
//       const flow = processFlows[0]; // Load the first flow for simplicity
//       setNodes(flow.nodes || []);
//       setEdges(flow.edges || []);
//     }
//     console.log(processFlows)
//   }, [processFlows]);

//   const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

//   const saveFlowChart = () => {
//     const processFlowData = {
//       processName: "My Process Flow",
//       nodes,
//       edges,
//     };
//     dispatch(saveProcessFlow(processFlowData));
//   };

//   // const deleteNodeFromBackend = async (nodeId) => {
//   //   try {
     
//   //     await axios.delete('/api/user/delete-node', {
//   //       data: {  nodeId },
//   //     });
//   //   } catch (error) {
//   //     console.error('Error deleting node from backend', error);
//   //   }
//   // };

//   const deleteNodeFromBackend = async (boundaryId, fieldName,nodeId) => {
//     try {
//       // Send boundary ID and field name to the backend
//       await axios.delete('/api/user/delete-node', {
//         data: { boundaryId, fieldName,nodeId },
//       });
//       console.log(`Field "${fieldName}" deleted from boundary ID "${boundaryId}"`);
//     } catch (error) {
//       console.error('Error deleting field from backend:', error);
//     }
//   };
  

//   const deleteEdgeFromBackend = async (edgeId) => {
//     try {
    
//       await axios.delete('/api/user/delete-edge', {
//         data: {edgeId },
//       });
//     } catch (error) {
//       console.error('Error deleting edge from backend', error);
//     }
//   };

//   // const onNodesDelete = async (nodesToRemove) => {
//   //   setNodes((nds) =>
//   //     nds.filter((node) => !nodesToRemove.some((n) => n.id === node.id))
//   //   );
//   //   // Delete the node from the backend
//   //   for (const node of nodesToRemove) {
//   //     await deleteNodeFromBackend(node.id);
//   //   }
//   // };

//   const onNodesDelete = async (nodesToRemove) => {
//     // Update local state to remove the deleted nodes
//     setNodes((nds) =>
//       nds.filter((node) => !nodesToRemove.some((n) => n.id === node.id))
//     );
  
//     // Iterate through nodes to delete corresponding fields
//     for (const node of nodesToRemove) {
//       const { boundaryId, fieldName } = node.data; // Extract boundary ID and field name
//       if (boundaryId && fieldName) {
//         await deleteNodeFromBackend(boundaryId, fieldName,node.id); // Send data to backend
//       }
//     }
//   };
  

//   const onEdgesDelete = async (edgesToRemove) => {
//     setEdges((eds) =>
//       eds.filter((edge) => !edgesToRemove.some((e) => e.id === edge.id))
//     );
//     // Delete the edge from the backend
//     for (const edge of edgesToRemove) {
//       await deleteEdgeFromBackend(edge.id);
//     }
//   };

//   return (
//     <div style={{  width: 1000, border: "1px solid #ddd"}}>
//       <ReactFlow
       
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         onNodesDelete={onNodesDelete}
//         onEdgesDelete={onEdgesDelete}
//         fitView
//       >
//         <Background />
//         <MiniMap />
//         <Controls />
//       </ReactFlow>
//       <Button variant="contained" color="primary" onClick={saveFlowChart}>Save Flow Chart</Button>
//     </div>
//   );
// };

// export default ProcessFlowChart;


import React, { useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";
import { Button, Tooltip } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchBoundaries } from "../../../redux/features/boundarySlice/BoundarySlice";
import { saveProcessFlow, fetchProcessFlows } from "../../../redux/features/boundarySlice/ProcessFlowSlice";

const createNodes = (boundary, startIndex) => {
  const { scopes } = boundary;
  return Object.entries(boundary)
    .filter(([fieldName]) => !["_id", "__v", "scopes"].includes(fieldName))
    .map(([fieldName, value], index) => {
      const label = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: ${value || "N/A"}`;
      return {
        id: `node-${startIndex + index}`,
        type: "default",
        data: { 
          label, 
          boundaryId: boundary._id, 
          fieldName, 
          scopeDetails: scopes || []  
        },
        position: { x: 250 + index * 200, y: startIndex * 150 },
      };
    });
};

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
      <Tooltip
        title={<div style={{ maxWidth: 300 }}>{scopeDetails}</div>}
        arrow
      >
        <span style={{ cursor: "pointer" }}>{node.data.label}</span>
      </Tooltip>
    );
  }

  return <span>{node.data.label}</span>; 
};


const ProcessFlowChart = () => {
  const dispatch = useDispatch();
  const boundaries = useSelector((state) => state.boundaries.data);
  const processFlows = useSelector((state) => state.processFlow.processFlows);

  const [boundaryNodes, setBoundaryNodes] = useState([]);
  const [flowNodes, setFlowNodes] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    dispatch(fetchBoundaries());
  }, [dispatch]);

  useEffect(() => {
    if (boundaries?.length) {
      const newBoundaryNodes = boundaries.flatMap((boundary, index) =>
        createNodes(boundary, index * 5)
      );
      setBoundaryNodes(newBoundaryNodes);
    }
  }, [boundaries]);

  useEffect(() => {
    if (boundaries?.length) {
      dispatch(fetchProcessFlows());
    }
  }, [dispatch, boundaries]);

  useEffect(() => {
    if (processFlows.length > 0) {
      const flow = processFlows[0];
      const loadedNodes = flow.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          label: renderNodeLabel(node), 
        },
      }));
  
      setFlowNodes(loadedNodes);
      setEdges(flow.edges || []);
    }
  }, [processFlows, boundaries]);
  

  useEffect(() => {
    setNodes([...boundaryNodes, ...flowNodes]);
  }, [boundaryNodes, flowNodes]);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  
  const saveFlowChart = () => {
    const processFlowData = {
      processName: "My Process Flow",
      nodes: nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          label: typeof node.data.label === "string"
            ? node.data.label
            : node.data.label.props.children, 
        },
      })),
      edges,
    };
    dispatch(saveProcessFlow(processFlowData));
    dispatch(fetchProcessFlows());
  };
  
  
  return (
    <div style={{ width: 1000, border: "1px solid #ddd" }}>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            label: renderNodeLabel(node), // Render the label dynamically
          },
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
      <Button variant="contained" color="primary" onClick={saveFlowChart}>
        Save Flow Chart
      </Button>
    </div>
  );
};

export default ProcessFlowChart;




