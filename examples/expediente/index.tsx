import React, { FunctionComponent, Fragment } from "react";
import {
  Chip,
  Avatar,
  Button,
  Popover,
  Grid
} from "@material-ui/core";
import InvertColorsIcon from "@material-ui/icons/InvertColors";
import MUIRichTextEditor from "../..";
import { TToolbarComponentProps } from "../../src/components/Toolbar";
import { EditorState, Modifier, ContentBlock, ContentState } from "draft-js";

const save = (data: string) => {
  console.log(data);
};

const MyBlock = (props: any) => {
  return (
    <div
      style={{
        padding: 10,
        backgroundColor: "#ebebeb"
      }}
    >
      My Block says:
      {props.children}
    </div>
  );
};

const MyCallbackComponent: FunctionComponent<TToolbarComponentProps> = props => {
  return (
    <Chip
      id={props.id}
      avatar={<Avatar>C</Avatar>}
      onClick={props.onMouseDown}
      label="aaa"
      disabled={props.disabled}
    />
  );
};

const AgregarEntidadComponent: FunctionComponent<TToolbarComponentProps> = props => {
  return (
    <Chip
      id={props.id}
      avatar={<Avatar>E</Avatar>}
      onClick={props.onMouseDown}
      label="Entidad"
      disabled={props.disabled}
    />
  );
};

const ClearComponent: FunctionComponent<TToolbarComponentProps> = props => {
  return (
    <Chip
      id={props.id}
      onClick={props.onMouseDown}
      label="Clear all"
      disabled={props.disabled}
    />
  );
};

const JusticiabletDecorator = (props: any) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const contentState: ContentState = props.contentState;
  const entity = contentState.getEntity(props.entityKey);
  return (
    <Fragment>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
      >
        <Grid container style={{margin: "1em"}}>
          {Object.keys(entity.getData()).map(clave => (
            <Grid container item xs={12} style={{width: "20em"}}>
              <Grid item xs={4}>
                <b>{clave}: </b>
              </Grid>
              <Grid item xs={6}>
                {entity.getData()[clave]}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Popover>
      <span
        onClick={handleClick}
        style={{
          backgroundColor: "lemonchiffon",
          borderRadius: "3px",
          cursor: "pointer"
        }}
      >
        {props.children}
      </span>
    </Fragment>
  );
};

const MyBlockComponent: FunctionComponent<TToolbarComponentProps> = props => {
  return (
    <Button
      id={props.id}
      variant="contained"
      onMouseDown={props.onMouseDown}
      color={props.active ? "primary" : "default"}
      disabled={props.disabled}
    >
      My Block
    </Button>
  );
};

const ExpedienteEjemplo = () => {
  return (
    <MUIRichTextEditor
      label="Type something here..."
      onSave={save}
      controls={["agregar-entidad"]}
      decorators={[
        {
          component: JusticiabletDecorator,
          entityType: "justiciable"
        }
      ]}
      customControls={[
        {
          name: "my-style",
          icon: <InvertColorsIcon />,
          type: "inline",
          inlineStyle: {
            backgroundColor: "black",
            color: "white"
          }
        },
        {
          name: "my-block",
          component: MyBlockComponent,
          type: "block",
          blockWrapper: <MyBlock />
        },
        {
          name: "my-callback",
          component: MyCallbackComponent,
          type: "callback",
          onClick: (_, name) => {
            console.log(`Clicked ${name} control`);
          }
        },
        {
          name: "agregar-entidad",
          component: AgregarEntidadComponent,
          type: "callback",
          onClick: estado => {
            const editorState = estado;
            const contentstate = editorState.getCurrentContent();

            // Returns ContentState record updated to include the newly created DraftEntity record in it's EntityMap.
            let newContentState = contentstate.createEntity(
              "MENTION",
              "IMMUTABLE",
              { 
                justiciableId: "un justiciable id",
                entityType: "justiciable"
              },

            );

            // Call getLastCreatedEntityKey to get the key of the newly created DraftEntity record.
            const entityKey = contentstate.getLastCreatedEntityKey();

            // Get the current selection
            const selectionState = editorState.getSelection();

            // Add the created entity to the current selection, for a new contentState
            newContentState = Modifier.applyEntity(
              newContentState,
              selectionState,
              entityKey
            );

            // Add newContentState to the existing editorState, for a new editorState
            const newEditorState = EditorState.push(
              editorState,
              newContentState,
              "apply-entity"
            );

            return newEditorState;
          }
        },
        {
          name: "clear-callback",
          component: ClearComponent,
          type: "callback",
          onClick: () => {
            return EditorState.createEmpty();
          }
        }
      ]}
    />
  );
};

export default ExpedienteEjemplo;
