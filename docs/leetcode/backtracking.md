# 回溯

### 46 全排列
哎这题竟然不会了，好像高中的时候还做过的，看答案继续学习吧
感觉思路就是要找到一种有序且不遗漏的方法来遍历
本题中即为从左到右每次固定一个数，剩下的数继续递归，但是有点新意的是如何保证固定的数是未被交换过的，一种方法是使用一个布尔数组来记录，另一种方法是直接交换数组中的数来保证不重复，第二种更省一点空间，👍

```cpp
class Solution {
public:
    vector<vector<int>> ans;
    vector<vector<int>> permute(vector<int>& nums) {
        backtrack(0,nums,nums);
        return ans;
    }

    void backtrack(int first, vector<int>& nums, vector<int>& output) {
        int n = nums.size();
        if (first == n) {
            ans.push_back(output);
            return;
        } else {
            for (int i = first; i < n; i++) {
                swap(output[first], output[i]);
                backtrack(first+1,nums,output);
                swap(output[first], output[i]);
            }
        }
    }
};
```