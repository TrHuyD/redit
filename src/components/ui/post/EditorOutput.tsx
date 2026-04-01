'use client'

import dynamic from 'next/dynamic';
import CustomImageRenderer from '../renderers/CustomImageRenderer';
import { el } from 'date-fns/locale';

const Output = dynamic (async () => (await import('editorjs-react-renderer')).default, 
{
ssr:false,
})
interface EditorOutputProps {
    content :any
}
const style = {
    paragraph: {
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
    },
  }
  
const renderers = {
    image : CustomImageRenderer,
    code : CustomImageRenderer,
}
export default function EditorOutput({ content }: EditorOutputProps) {
    if (content.text||!content?.blocks?.text) {
    content = {
        time: Date.now(),
        blocks: [
        {
            id: "ec3b65e84f",
            type: 'paragraph',
            data: {
            text:  content?.text?.replace(/`/g, '')??"empty",
            },
        },
        ],
        version: '2.27.0',
    };
    }
  return <Output className="text-sm" style={{}} data={content} renderers={{}} />;
}