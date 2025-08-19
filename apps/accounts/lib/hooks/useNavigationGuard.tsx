import { useNavigationGuard as useNavigationGuardOriginal } from "next-navigation-guard";
import { useState } from "react";
import { flushSync } from "react-dom";

type UseNavigationGuard = typeof useNavigationGuardOriginal;
type UseNavigationGuardOptions = Parameters<
	typeof useNavigationGuardOriginal
>[0];
type Return = ReturnType<UseNavigationGuard>;

type Options = Omit<UseNavigationGuardOptions, "confirm"> & {
	confirm: NonNullable<UseNavigationGuardOptions["confirm"]>;
};

type UseFixedNavigationGuard = (options: Options) => Return;

export const useNavigationGuard: UseFixedNavigationGuard = (options) => {
	const [hasCalled, setHasCalled] = useState<boolean>(false);

	return useNavigationGuardOriginal({
		...options,
		confirm: async (params) => {
			if (hasCalled) {
				return false;
			}

			const isConfirmed = await options.confirm(params);

			flushSync(() => setHasCalled(true));

			setTimeout(() => {
				setHasCalled(false);
			}, 0);

			return isConfirmed;
		},
	});
};
