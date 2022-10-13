---
title: Neural Networks
title1: Neural Networks
...

# Training

Neural networks with enough layers are **universal function approximators**. 2 layers is often enough.

> Does the output of every layer sum to one?

$
\begin{align}
	P(C_i | x) & = \frac{P(x | C_i)P(C_i)}{P(x)} \\
	P(C_i | x) & = \frac{
		P(x | C_i)P(C_i)
	}{
		P(x)
	}                                            \\
\end{align}
$

> Is it similar to taylor approximation?

$
\begin{align}
	P(C_i | x) & = \frac{P(x | C_i)P(C_i)}{P(x)} \\
	P(C_i | x) & = \frac{
		P(x | C_i)P(C_i)
	}{
		P(x)
	}                                            \\
\end{align}
$


$
\begin{align}
	P(C_i | x) & = \frac{P(x | C_i)P(C_i)}{P(x)} \\
	P(C_i | x) & = \frac{
		P(x | C_i)P(C_i)
	}{
		P(x)
	}                                            \\
\end{align}
$

