<script setup lang="ts">
// !NOTE: https://prosemirror.net/docs/ref/#state.Plugin_System
// - utilize plugin system
import { ref, onMounted } from 'vue';

import { DOMParser, Node, NodeSpec, Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schema } from 'prosemirror-schema-basic';

import { undo, redo, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

import './../editor.css';

const my_node_spec: NodeSpec = {
  inline: true,
  group: 'inline',
  draggable: false,
  toDOM: () => {
    return [
      'div',
      ['span', { class: 'default-content hidden' }, '{{test}}'],
      ['p', { class: 'output-content' }, 'test'],
      ['div', { class: 'output-widget' }, ['div', 'widget']],
    ];
  },
};

const my_schema = new Schema({
  nodes: schema.spec.nodes.addToEnd('myNode', my_node_spec),
  marks: schema.spec.marks,
});

onMounted(() => {
  // State
  const content_ref = document.querySelector('#content') as HTMLElement;
  window.state = EditorState.create({
    schema,
    doc: DOMParser.fromSchema(my_schema).parse(content_ref),
    plugins: [
      history(),
      keymap({ 'Mod-z': undo, 'Mod-y': redo }),
      keymap(baseKeymap),
    ],
  });

  // View
  window.view = new EditorView(document.querySelector('#editor'), {
    state: window.state,
  });
  console.log(window.view);
});

const test_ref = ref(null);

let my_node_type = my_schema.nodes.myNode;
const addElement = () => {
  window.view.dispatch(
    window.state.tr.replaceSelectionWith(my_node_type.create({}))
  );
};
</script>

<template>
  <div class="bug h-[25rem] w-[25rem]">
    <h2 ref="test_ref">
      Prose Mirror Editor
      <!-- <span>test</span>
<img src="#" alt="qwe"> -->
    </h2>
    <div class="my-12">
      <button @click="addElement" class="py-2 px-5">Add</button>
    </div>
    <div id="editor"></div>
    <div id="content"></div>
  </div>
</template>

<style>
.bug {
  border: 1px solid red;
}
</style>
