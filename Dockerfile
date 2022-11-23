#
# Copyright 2022 ProboCI, LLC

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

# http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

FROM node:12-alpine

RUN mkdir -p /home/probo/app
COPY . /home/probo/app

RUN cd /home/probo/app/ && npm install

WORKDIR /home/probo/app

EXPOSE 8442

CMD ["sh", "/home/probo/app/bin/startup.sh"]