import dynamic from 'next/dynamic';
import CustomImageRenderer from '../renderers/CustomImageRenderer';

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
export default function EditorOutput({content}:EditorOutputProps)
{
    return <Output className='text-sm' style={style} data={content} renderers={renderers} />
}