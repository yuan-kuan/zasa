1. If you see an `SOP Error: []` (or `{}`, `undefined`, any Object). Likely you have create a Either, `free.right` or `free.left`, but forgot to use `free.bimap` or `free.bichain` on the Free Monad.
