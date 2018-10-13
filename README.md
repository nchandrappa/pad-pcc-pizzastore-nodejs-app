# pad-pcc-pizzastore-nodejs-app

A sample Pizzastore app backed by Pivotal Cloud Cache.

### App Usage


http://pcc-nodejs-app.xyz.com/pizzas

```
Lets Order Some Pizza 
-------------------------------
types: plain, fancy

GET /orderPizza?email={emailId}&type={pizzaType} - Order a pizza 
GET /orders?email={emailId} - get specific value 

```

http://pcc-nodejs-app.xyz.com/orderPizza?email=pad@xyz.com&type=fancy

```
Succesfully Placed Order For: pad@xyz.com
```

http://pcc-nodejs-app.xyz.com/orders?email=pad@xyz.com

```
{
	customer: "pad@pivotal.io",
	order: {
	type: "plain",
	toppings: [
	"cheese"
	],
	sauce: "red"
	}
}
```

### Prerequisites for NodeJS Client for PCC

* Ubuntu 14.04
* NodeJS version: v8.12.0
* NPM Version:  v6.4.1
* PCC Version: v1.4.0
* Pivotal GemFire: v9.3.0
* Pivotal GemFire Native Client Version: v9.2.1

### Steps for Building the NodeJS App


1. Clone the git repo on Ubuntu workstation

	```
	git clone https://github.com/nchandrappa/pad-pcc-pizzastore-nodejs-app.git
	```

2. Download the Pivotal GemFire Native Client v9.2.1 and extract the tar file into <dir>/pad-pcc-pizzastore-nodejs-app/lib/ 
	
	https://network.pivotal.io/products/pivotal-gemfire/#/releases/163130
	

3. Set the following environment variables on ubuntu workstation 

	```
	export GFCPP=<dir>/pad-pcc-pizzastore-nodejs-app/lib/pivotal-gemfire-native
	export PATH=$PATH:$GFCPP/bin
	export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$GFCPP/lib
	```

4. Npm install dependencies required for PCC client

	```
	npm install node-pre-gyp --save
	npm install gemfire --save
	```

### Create PCC Instance
Services can be created through Apps Manager Marketplace or by executing cf cli commands

###### Display available PCC plans
	
```
cf marketplace p-cloudcache
```
	

###### Step 1: create a PCC OnDemand service in your org & space
	
```
cf create-service p-cloudcache extra-small pcc-dev-cluster
```
	

###### Step 2: Create service key for retrieving connection information for GFSH cli

```
cf create-service-key workshop-pcc devkey
```

###### Step 3: Retrieve url for PCC cli (GFSH) and corresponding credentials 

```
cf service-key workshop-pcc devkey
```

###### Step 4: Login into to PCC cli (GFSH)

```
gfsh> connect --use-http=true --url=http://gemfire-xxxx-xxx-xx-xxxx.system.excelsiorcloud.com/gemfire/v1 --user=cluster_operator_xyz --password=*******
```

###### Step 5: create PCC regions

Note: Region name created on PCC server and client should match

```
gfsh> create region --name=pizza --type=PARTITION_REDUNDANT_PERSISTENT
```

### Deploy NodeJS app on PCF

###### Step 1: Update the manifest.yml to reflect PCC instance created from the earlier steps

```
---
applications:
- name: pcc-nodejs-app
  memory: 512M
  instances: 1
  buildpack: nodejs_buildpack
  command: scripts/start_nodefire.sh
  timeout: 180
  services:
   - pcc-dev-cluster
```

###### Step 2: Deploy the app onto PCF

```
cf push
```

