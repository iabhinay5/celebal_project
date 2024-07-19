import React, { useState, useEffect } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import socket from '../socket';

const CodeEditor = () => {
    const [code, setCode] = useState('');

    useEffect(() => {
        socket.on('codeChange', (newCode) => {
            setCode(newCode);
        });

        return () => {
            socket.off('codeChange');
        };
    }, []);

    const handleChange = (editor, data, value) => {
        setCode(value);
        socket.emit('codeChange', { room: 'default', code: value });
    };

    return (
        <div>
            <CodeMirror
                value={code}
                options={{
                    mode: 'javascript',
                    theme: 'material',
                    lineNumbers: true,
                }}
                onChange={handleChange}
            />
        </div>
    );
};

export default CodeEditor;
