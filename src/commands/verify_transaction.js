/*
 * LiskHQ/lisky
 * Copyright © 2017 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */
import transactions from '../utils/transactions';
import { ValidationError } from '../utils/error';
import { createCommand } from '../utils/helpers';
import commonOptions from '../utils/options';

const description = `Verify a transaction.

	Examples:
	- verify transaction '{"type":0,"amount":"100",...}'
	- verify transaction --second-publickey 647aac1e2df8a5c870499d7ddc82236b1e10936977537a3844a6b05ea33f9ef6 '{"type":0,"amount":"100",...}'
`;

const getTransactionInput = ({ transaction, stdin, shouldUseStdIn }) => {
	const hasStdIn = stdin && stdin[0];
	if (shouldUseStdIn && !hasStdIn) {
		throw new ValidationError('No transaction was provided.');
	}
	return shouldUseStdIn ? stdin[0] : transaction;
};

export const actionCreator = () => async ({ transaction, stdin, options }) => {
	const shouldUseStdIn = !transaction;
	const transactionInput = getTransactionInput({
		transaction,
		stdin,
		shouldUseStdIn,
	});
	let transactionObject;
	try {
		transactionObject = JSON.parse(transactionInput);
	} catch (error) {
		throw new ValidationError(
			'Could not parse transaction JSON. Did you use the `--json` option?',
		);
	}
	const secondPublicKey = options['second-public-key'] || null;
	const varified = transactions.utils.verifyTransaction(
		transactionObject,
		secondPublicKey,
	);
	return {
		varified,
	};
};

const verifyTransaction = createCommand({
	command: 'verify transaction [transaction]',
	description,
	actionCreator,
	options: [commonOptions.secondPublicKey],
	errorPrefix: 'Could not verify transaction',
});

export default verifyTransaction;
