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
import cryptography from '../utils/cryptography';
import { createCommand } from '../utils/helpers';
import { createMnemonicPassphrase } from '../utils/mnemonic';
import commonOptions from '../utils/options';

const description = `Returns a list of randomly-generated mnemonic passphrase with its corresponding public key and address.

	Examples:
	- create account
	- create account -n 50
`;

export const actionCreator = () => async ({ options = {} }) => {
	const { number = 1 } = options || {};

	const accountsArray = [];

	for (let i = 0; i < number; i += 1) {
		const passphrase = createMnemonicPassphrase();
		const { privateKey, publicKey } = cryptography.getKeys(passphrase);
		const { address } = cryptography.getAddressFromPublicKey(publicKey);
		accountsArray.push({
			passphrase,
			privateKey,
			publicKey,
			address,
		});
	}

	return accountsArray;
};

const createAccount = createCommand({
	command: 'create account',
	description,
	actionCreator,
	options: [commonOptions.numOfAccounts],
	errorPrefix: 'Could not create account',
});

export default createAccount;
