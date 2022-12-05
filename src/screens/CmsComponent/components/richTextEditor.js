import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

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
