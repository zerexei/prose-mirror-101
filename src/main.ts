import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'

declare global {
    interface Window {
        view: EditorView
        state: EditorState,
    }
}

createApp(App).mount('#app')


function handleClick() {
    console.log("hgit");
    
}