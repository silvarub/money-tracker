import { takeLatest, call, put, select } from 'redux-saga/effects'
import {
  sync,
  syncRequest,
  syncSuccess,
  syncFailure,
  setPendingChangesFlag
} from '../actions/ui/sync'
import {
  saveAccountSuccess,
  removeAccountSuccess
} from '../actions/entities/accounts'
import { saveTransactionSuccess } from '../actions/entities/transactions'
import { loadAccountsSaga } from './accounts'
import { loadTagsSaga } from './tags'
import { loadRecentTransactionsSaga } from './transactions'
import { isDemo } from '../selectors/user'
import AccountsStorage from '../util/storage/accounts'
import TransactionsStorage from '../util/storage/transactions'
import TagsStorage from '../util/storage/tags'

export function* syncSaga() {
  yield put(syncRequest())
  try {
    const readOnly = yield select(isDemo)
    yield call(AccountsStorage.sync, readOnly)
    yield loadAccountsSaga()
    yield call(TransactionsStorage.sync, readOnly)
    yield loadRecentTransactionsSaga()
    yield call(TagsStorage.sync, readOnly)
    yield loadTagsSaga()
    yield put(syncSuccess())
  } catch (error) {
    yield put(syncFailure(error))
  }
}

export function* setPendingChangesFlagSaga() {
  yield put(setPendingChangesFlag())
}

export default [
  takeLatest(sync, syncSaga),
  takeLatest(saveAccountSuccess, setPendingChangesFlagSaga),
  takeLatest(removeAccountSuccess, setPendingChangesFlagSaga),
  takeLatest(saveTransactionSuccess, setPendingChangesFlagSaga)
]
