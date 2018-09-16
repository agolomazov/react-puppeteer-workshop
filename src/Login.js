import React from 'react';

export default function Login(props) {
	return (
		<div className="login-page">
			<div className="form">
				<form className="login-form" onSubmit={props.submit}>
					<input onChange={props.input} type="text" placeholder="First Name" data-testid="firstName" />
					<input type="text" placeholder="Last Name" data-testid="lastName" />
					<input type="text" placeholder="Email" data-testid="email" />
					<input type="password" placeholder="Password" data-testid="password" />
					<button data-testid="submit">Login</button>
				</form>
			</div>
		</div>
	);
}
