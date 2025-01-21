import 'reflect-metadata';
import supabase from '../../../../infrastructure/database/supabaseConfig';

import { AppFunctionsForTestsRepository } from '../../../../infrastructure/database/repositories/AppFetchingForTestsRepository';

jest.mock('../../../../infrastructure/database/supabaseConfig');

describe('test if the function of getting the usersInfo with list-id alone works', () => {
  let appFunctionsForTestsRepository: AppFunctionsForTestsRepository;

  beforeEach(() => {
    appFunctionsForTestsRepository = new AppFunctionsForTestsRepository();
  });

  it('should retrieve the proper beneficiaries with the listId', async () => {
    const mockData = [{ user_id: '116', userName: 'rombasly@gmail.com' }];

    const eqMock = jest.fn(() => Promise.resolve({ data: mockData }));
    const selectMock = jest.fn(() => ({ eq: eqMock }));
    const fromMock = jest.fn(() => ({ select: selectMock }));

    // Assign the fromMock to supabase.from
    (supabase.from as any) = fromMock;

    const result = await appFunctionsForTestsRepository.getBeneficiariesByListId(
      'ce58393b-45b8-41b6-9a36-71b7830b0444',
      116
    );

    // Assertions
    expect(fromMock).toHaveBeenCalledWith('app-list-beneficiaries');
    expect(selectMock).toHaveBeenCalledWith('app-users:user-id(user_id, userName)');
    expect(eqMock).toHaveBeenCalledWith('app-list-id', 'ce58393b-45b8-41b6-9a36-71b7830b0444');
    expect(result).toEqual(mockData);
  });
});
