import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import ColorPic  from "./colorPic";

class EditorConvertToHTML extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  componentDidMount() {
    const parentState = this.props.parentState;
    console.log("parentState-1", parentState);
    const contentBlock = htmlToDraft(parentState);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState,
      });
    }
  }

  onEditorStateChange = (editorState) => {
    // if (editorState) {
    this.setState({
      editorState,
    });
    const data = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    console.log("data-00", data);
    this.props.handleChangeState(data);
    // }
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          toolbarClassName="toolbar-class"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            fontFamily: {
              options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana','Noto Serif,serif', ],
              className: undefined,
              component: undefined,
              dropdownClassName: undefined,
            },
            colorPicker: { colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
            'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
            'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
            'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
            'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
            'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)','rgb(47,52,139)'],}
          }}
        />
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    );
  }
}

export default EditorConvertToHTML;
