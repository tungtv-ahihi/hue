// Licensed to Cloudera, Inc. under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  Cloudera, Inc. licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import StorageBrowserRowActions from './StorageBrowserRowActions';
import { StorageBrowserTableData } from '../../../../reactComponents/FileChooser/types';

describe('StorageBrowserRowActions', () => {
  //View summary option is enabled and added to the actions menu when the row data is either hdfs/ofs and a single file
  const mockRecord: StorageBrowserTableData = {
    name: 'test',
    size: '0\u00a0bytes',
    user: 'demo',
    group: 'demo',
    permission: 'drwxr-xr-x',
    mtime: 'May 12, 2024 10:37 PM',
    type: '',
    path: ''
  };
  test('renders view summary option when record is a hdfs file', async () => {
    const onViewSummary = jest.fn();
    const user = userEvent.setup();
    mockRecord.path = '/user/demo/test';
    mockRecord.type = 'file';
    const { getByRole, queryByRole } = render(
      <StorageBrowserRowActions rowData={mockRecord} onViewSummary={onViewSummary} />
    );
    await user.click(getByRole('button'));
    expect(queryByRole('menuitem', { name: 'View Summary' })).not.toBeNull();
  });

  test('renders view summary option when record is a ofs file', async () => {
    const onViewSummary = jest.fn();
    const user = userEvent.setup();
    mockRecord.path = 'ofs://demo/test';
    mockRecord.type = 'file';
    const { getByRole, queryByRole } = render(
      <StorageBrowserRowActions rowData={mockRecord} onViewSummary={onViewSummary} />
    );
    await user.click(getByRole('button'));
    expect(queryByRole('menuitem', { name: 'View Summary' })).not.toBeNull();
  });

  test('does not render view summary option when record is a hdfs folder', async () => {
    const onViewSummary = jest.fn();
    const user = userEvent.setup();
    mockRecord.path = '/user/demo/test';
    mockRecord.type = 'dir';
    const { getByRole, queryByRole } = render(
      <StorageBrowserRowActions rowData={mockRecord} onViewSummary={onViewSummary} />
    );
    await user.click(getByRole('button'));
    expect(queryByRole('menuitem', { name: 'View Summary' })).toBeNull();
  });

  test('does not render view summary option when record is a an abfs file', async () => {
    const onViewSummary = jest.fn();
    const user = userEvent.setup();
    mockRecord.path = 'abfs://demo/test';
    mockRecord.type = 'file';
    const { getByRole, queryByRole } = render(
      <StorageBrowserRowActions rowData={mockRecord} onViewSummary={onViewSummary} />
    );
    await user.click(getByRole('button'));
    expect(queryByRole('menuitem', { name: 'View Summary' })).toBeNull();
  });

  test('calls onViewSummary after View summary menu option is clicked', async () => {
    const onViewSummary = jest.fn();
    const user = userEvent.setup();
    mockRecord.path = '/user/demo/test';
    mockRecord.type = 'file';
    const { getByRole } = render(
      <StorageBrowserRowActions rowData={mockRecord} onViewSummary={onViewSummary} />
    );
    await user.click(getByRole('button'));
    expect(onViewSummary).not.toBeCalled();
    await user.click(getByRole('menuitem', { name: 'View Summary' }));
    expect(onViewSummary).toBeCalled();
  });
});
