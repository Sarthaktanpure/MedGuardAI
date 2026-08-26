async function main() {
  const factory = await ethers.getContractFactory("BatchRegistry");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  console.log("BatchRegistry deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
