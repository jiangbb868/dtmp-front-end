<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 加班管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" @click="handleAdd()" class="handle-del mr10">添加</el-button>
                <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="date" label="加班日期" sortable width="120">
                </el-table-column>
                <el-table-column prop="startTime" label="开始时间" width="120">
                </el-table-column>
                <el-table-column prop="stopTime" label="结束时间" width="120">
                </el-table-column>  
                <el-table-column prop="timeSpan" label="加班时长(小时)" width="120">
                </el-table-column>                               
                <el-table-column prop="reason" label="加班事由" width="210">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="加班日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="姓           名">
                    <el-input v-model="form.userId"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-input v-model="form.startTime"></el-input>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-input v-model="form.stopTime"></el-input>
                </el-form-item>
                <el-form-item label="加班事由">
                    <el-input v-model="form.reason"></el-input>
                </el-form-item>                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                operType: '添加加班记录',
                form: {
                    userId: '',
                    startTime: '',
                    stopTime: '',
                    timeSpan: '',
                    reason: ''
                },
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    /*
                    for (let i = 0; i < this.del_list.length; i++) {
                        alert(this.del_list);
                        if (d.userId === this.del_list[i].userId) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(this.select_cate) > -1 &&
                            (d.userId.indexOf(this.select_word) > -1 ||
                                d.address.indexOf(this.select_word) > -1)
                        ) {
                            alert(d);
                            return d;
                        }
                    }
                    */
                    d.timeSpan = d.stopTime - d.startTime;
                    return d;
                })
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
                    this.url = '/work/overtime/getList';
                };
                this.$axios.get(this.url, {
                    params: {
                        userId: "1"
                    }
                }).then((res) => {
                    // alert(res.data.status + res.data.message);
                    // alert(res.data.data[0].startTime);
                    this.tableData = res.data.data;
                })
            },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    userId: item.userId,
                    date: item.date,
                    startTime: item.startTime,
                    stopTime: item.stopTime,
                    reason: item.reason
                }
                this.operType = '编辑加班记录';
                this.editVisible = true;
            },
            handleAdd() {
                this.form = {
                    userId: '',
                    date: '',
                    startTime: '',
                    stopTime: '',
                    reason: ''
                }
                this.operType = '添加加班记录';
                this.editVisible = true;
            },            
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].userId + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                //this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                const item = this.tableData[this.idx];
                const data = {
                    workOvertimeId: 1,
                    date: item.date,
                    userId: item.userId,
                    startTime: '2018-05-24 17:00:00',
                    stopTime: '2018-05-24 20:30:00',
                    reason: item.reason                    
                }
                this.$axios.post('/work/overtime/add', data).then((res) => {
                    getData();
                    this.$message.success(`修改第 ${this.idx+1} 行成功`);
                })
                
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.delVisible = false;
                const item = this.tableData[this.idx];
                const data = {
                    workOvertimeId: 1
                }
                this.$axios.post('/work/overtime/delete', data).then((res) => {
                    getData();
                    this.$message.success('删除成功');
                })
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>
