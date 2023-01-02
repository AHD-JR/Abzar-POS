import { configureStore } from '@reduxjs/toolkit'
import staffSlice from './actions/staffSlice'
import adminSlice from './actions/adminSlice'


export default configureStore({
  reducer: {
    admin: adminSlice,
    staff: staffSlice
  },
})
