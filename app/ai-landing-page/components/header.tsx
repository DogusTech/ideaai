import { useState } from 'react';

default function Header() {
	const [visible, setVisible] = useState(false);
	return (
		<div>
			<button onClick={() => setVisible(true)}>Toggle</button>
			{visible && <div>Visible!</div>}
		</div>
	);
}